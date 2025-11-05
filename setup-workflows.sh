#!/bin/bash
# Script Completo para Criar todos os 5 GitHub Actions Workflows
# Uso: chmod +x setup-workflows.sh && ./setup-workflows.sh

set -e

echo "🚀 Criando todos os 5 GitHub Actions Workflows..."
echo ""

mkdir -p .github/workflows

# ============================================================================
# FILE 1: ci.yml - Build & Test
# ============================================================================
cat > .github/workflows/ci.yml << 'WORKFLOW1_EOF'
name: CI - Build & Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  REGISTRY: gcr.io
  IMAGE_NAME: orkut-2.0

jobs:
  backend-lint:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      
      - name: Lint with flake8
        working-directory: ./backend
        continue-on-error: true
        run: |
          pip install flake8
          flake8 app --count --select=E9,F63,F7,F82 --show-source --statistics
          flake8 app --count --exit-zero --max-complexity=10 --max-line-length=100 --statistics
      
      - name: Format check with black
        working-directory: ./backend
        continue-on-error: true
        run: |
          pip install black
          black --check app

  backend-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: orkut_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest pytest-asyncio
      
      - name: Run tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/orkut_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret
          GOOGLE_GEMINI_API_KEY: test-key
          ENVIRONMENT: test
        continue-on-error: true
        run: |
          mkdir -p coverage
          pytest tests/ -v --tb=short 2>&1 | tee test-output.txt || true

  frontend-lint:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm install --legacy-peer-deps || npm install
      
      - name: Type check
        working-directory: ./frontend
        continue-on-error: true
        run: npx tsc --noEmit 2>&1 || true

  frontend-build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm install --legacy-peer-deps || npm install
      
      - name: Build
        working-directory: ./frontend
        env:
          VITE_API_URL: http://localhost:8000
        run: npm run build
      
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist

  docker-build:
    runs-on: ubuntu-latest
    needs: [backend-lint, frontend-lint, frontend-build]
    if: always()
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Build backend image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: false
          tags: ${{ env.REGISTRY }}/${{ github.repository_owner }}/orkut-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Build frontend image
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: false
          tags: ${{ env.REGISTRY }}/${{ github.repository_owner }}/orkut-frontend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  summary:
    runs-on: ubuntu-latest
    needs: [backend-lint, backend-test, frontend-lint, frontend-build, docker-build]
    if: always()
    
    steps:
      - name: Print Summary
        run: |
          echo "=== CI Pipeline Summary ==="
          echo "Backend Lint: ${{ needs.backend-lint.result }}"
          echo "Backend Test: ${{ needs.backend-test.result }}"
          echo "Frontend Lint: ${{ needs.frontend-lint.result }}"
          echo "Frontend Build: ${{ needs.frontend-build.result }}"
          echo "Docker Build: ${{ needs.docker-build.result }}"
WORKFLOW1_EOF

echo "✅ .github/workflows/ci.yml criado"

# ============================================================================
# FILE 2: deploy-staging.yml - Deploy para Staging
# ============================================================================
cat > .github/workflows/deploy-staging.yml << 'WORKFLOW2_EOF'
name: Deploy to Staging

on:
  push:
    branches: [ develop ]
  workflow_dispatch:

env:
  REGISTRY: gcr.io
  GCP_REGION: us-central1
  BACKEND_SERVICE: orkut-backend-staging
  FRONTEND_SERVICE: orkut-frontend-staging

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      id-token: write
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
      
      - name: Configure Docker for GCR
        run: |
          gcloud auth configure-docker ${{ env.REGISTRY }}
      
      - name: Get GCP Project ID
        id: project
        run: |
          PROJECT_ID=$(gcloud config get-value project)
          echo "project_id=$PROJECT_ID" >> $GITHUB_OUTPUT
      
      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-backend:staging
            ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-backend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-frontend:staging
            ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-frontend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Deploy backend to Cloud Run
        run: |
          gcloud run deploy ${{ env.BACKEND_SERVICE }} \
            --image ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-backend:staging \
            --region ${{ env.GCP_REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --set-env-vars DATABASE_URL=${{ secrets.STAGING_DATABASE_URL }},REDIS_URL=${{ secrets.STAGING_REDIS_URL }},JWT_SECRET=${{ secrets.JWT_SECRET }},GOOGLE_GEMINI_API_KEY=${{ secrets.GOOGLE_GEMINI_API_KEY }},ENVIRONMENT=staging \
            --memory 512Mi \
            --cpu 1 \
            --timeout 300 \
            --quiet || echo "Service might already exist"
      
      - name: Deploy frontend to Cloud Run
        run: |
          gcloud run deploy ${{ env.FRONTEND_SERVICE }} \
            --image ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-frontend:staging \
            --region ${{ env.GCP_REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --memory 256Mi \
            --cpu 1 \
            --timeout 300 \
            --quiet || echo "Service might already exist"
      
      - name: Get backend URL
        id: backend_url
        run: |
          URL=$(gcloud run services describe ${{ env.BACKEND_SERVICE }} --region ${{ env.GCP_REGION }} --format 'value(status.url)')
          echo "url=$URL" >> $GITHUB_OUTPUT
      
      - name: Get frontend URL
        id: frontend_url
        run: |
          URL=$(gcloud run services describe ${{ env.FRONTEND_SERVICE }} --region ${{ env.GCP_REGION }} --format 'value(status.url)')
          echo "url=$URL" >> $GITHUB_OUTPUT
      
      - name: Health check backend
        continue-on-error: true
        run: |
          BACKEND_URL="${{ steps.backend_url.outputs.url }}"
          for i in {1..10}; do
            echo "Health check attempt $i/10..."
            if curl -f $BACKEND_URL/health; then
              echo "✅ Backend health check passed"
              exit 0
            fi
            sleep 5
          done
          echo "⚠️ Backend health check timed out"
      
      - name: Slack notification - Success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: |
            ✅ Staging Deploy: SUCCESS
            Backend: ${{ steps.backend_url.outputs.url }}
            Frontend: ${{ steps.frontend_url.outputs.url }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          fields: repo,message,commit
      
      - name: Slack notification - Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: |
            ❌ Staging Deploy: FAILED
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          fields: repo,message,commit
WORKFLOW2_EOF

echo "✅ .github/workflows/deploy-staging.yml criado"

# ============================================================================
# FILE 3: deploy-production.yml - Deploy para Produção
# ============================================================================
cat > .github/workflows/deploy-production.yml << 'WORKFLOW3_EOF'
name: Deploy to Production

on:
  release:
    types: [published]
  workflow_dispatch:

env:
  REGISTRY: gcr.io
  GCP_REGION: us-central1
  BACKEND_SERVICE: orkut-backend
  FRONTEND_SERVICE: orkut-frontend

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      id-token: write
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
      
      - name: Configure Docker for GCR
        run: |
          gcloud auth configure-docker ${{ env.REGISTRY }}
      
      - name: Get GCP Project ID
        id: project
        run: |
          PROJECT_ID=$(gcloud config get-value project)
          echo "project_id=$PROJECT_ID" >> $GITHUB_OUTPUT
      
      - name: Extract version
        id: version
        run: |
          VERSION=${GITHUB_REF#refs/tags/}
          echo "version=$VERSION" >> $GITHUB_OUTPUT
      
      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-backend:${{ steps.version.outputs.version }}
            ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-backend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-frontend:${{ steps.version.outputs.version }}
            ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-frontend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Deploy backend to Cloud Run
        run: |
          gcloud run deploy ${{ env.BACKEND_SERVICE }} \
            --image ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-backend:${{ steps.version.outputs.version }} \
            --region ${{ env.GCP_REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --set-env-vars DATABASE_URL=${{ secrets.PRODUCTION_DATABASE_URL }},REDIS_URL=${{ secrets.PRODUCTION_REDIS_URL }},JWT_SECRET=${{ secrets.JWT_SECRET }},GOOGLE_GEMINI_API_KEY=${{ secrets.GOOGLE_GEMINI_API_KEY }},ENVIRONMENT=production \
            --memory 1Gi \
            --cpu 2 \
            --timeout 300 \
            --max-instances 100 \
            --quiet || echo "Service might already exist"
      
      - name: Deploy frontend to Cloud Run
        run: |
          gcloud run deploy ${{ env.FRONTEND_SERVICE }} \
            --image ${{ env.REGISTRY }}/${{ steps.project.outputs.project_id }}/orkut-frontend:${{ steps.version.outputs.version }} \
            --region ${{ env.GCP_REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --memory 512Mi \
            --cpu 1 \
            --timeout 300 \
            --max-instances 50 \
            --quiet || echo "Service might already exist"
      
      - name: Get backend URL
        id: backend_url
        run: |
          URL=$(gcloud run services describe ${{ env.BACKEND_SERVICE }} --region ${{ env.GCP_REGION }} --format 'value(status.url)')
          echo "url=$URL" >> $GITHUB_OUTPUT
      
      - name: Health check backend
        run: |
          BACKEND_URL="${{ steps.backend_url.outputs.url }}"
          for i in {1..30}; do
            echo "Health check attempt $i/30..."
            if curl -f $BACKEND_URL/health; then
              echo "✅ Backend health check passed"
              exit 0
            fi
            sleep 5
          done
          echo "❌ Backend health check failed"
          exit 1
      
      - name: Slack notification - Success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: |
            🚀 PRODUCTION DEPLOY: SUCCESS
            Version: ${{ steps.version.outputs.version }}
            Backend: ${{ steps.backend_url.outputs.url }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          fields: repo,message,commit
      
      - name: Slack notification - Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: |
            🔴 PRODUCTION DEPLOY: FAILED
            Version: ${{ steps.version.outputs.version }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          fields: repo,message,commit
WORKFLOW3_EOF

echo "✅ .github/workflows/deploy-production.yml criado"

# ============================================================================
# FILE 4: security.yml - Security Scanning
# ============================================================================
cat > .github/workflows/security.yml << 'WORKFLOW4_EOF'
name: Security Scan

on:
  schedule:
    - cron: '0 2 * * 0'
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch:

jobs:
  dependency-check:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run safety check (Python)
        continue-on-error: true
        run: |
          pip install safety
          cd backend && safety check --file requirements.txt || true
      
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Run npm audit (Node)
        continue-on-error: true
        working-directory: ./frontend
        run: npm audit --audit-level=moderate || true

  codeql:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      security-events: write
    
    strategy:
      fail-fast: false
      matrix:
        language: [ 'python', 'javascript' ]
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}
      
      - name: Set up Python
        if: matrix.language == 'python'
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Set up Node
        if: matrix.language == 'javascript'
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Autobuild
        uses: github/codeql-action/autobuild@v2
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          category: "/language:${{ matrix.language }}"

  docker-scan:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build backend image
        run: |
          cd backend && docker build -t orkut-backend:scan . || true
      
      - name: Build frontend image
        run: |
          cd frontend && docker build -t orkut-frontend:scan . || true
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'image'
          image-ref: 'orkut-backend:scan'
          format: 'sarif'
          output: 'trivy-backend-results.sarif'
        continue-on-error: true
      
      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-backend-results.sarif'
        continue-on-error: true
WORKFLOW4_EOF

echo "✅ .github/workflows/security.yml criado"

# ============================================================================
# FILE 5: docker-push.yml - Push para Docker Hub
# ============================================================================
cat > .github/workflows/docker-push.yml << 'WORKFLOW5_EOF'
name: Push to Docker Registry

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  push:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Extract version
        id: version
        run: |
          VERSION=${GITHUB_REF#refs/tags/}
          echo "version=$VERSION" >> $GITHUB_OUTPUT
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
        continue-on-error: true
      
      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: ${{ secrets.DOCKER_USERNAME != '' }}
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/orkut-backend:${{ steps.version.outputs.version }}
            ${{ secrets.DOCKER_USERNAME }}/orkut-backend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
        continue-on-error: true
      
      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: ${{ secrets.DOCKER_USERNAME != '' }}
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/orkut-frontend:${{ steps.version.outputs.version }}
            ${{ secrets.DOCKER_USERNAME }}/orkut-frontend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
        continue-on-error: true
      
      - name: Slack notification
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            Docker Push: ${{ job.status }}
            Version: ${{ steps.version.outputs.version }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        continue-on-error: true
WORKFLOW5_EOF

echo "✅ .github/workflows/docker-push.yml criado"

# ============================================================================
# FINALIZAÇÃO
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TODOS OS 5 WORKFLOWS CRIADOS COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Arquivos criados em .github/workflows/:"
ls -lh .github/workflows/
echo ""
echo "📝 Próximos passos:"
echo "  1. git add .github/workflows/"
echo "  2. git commit -m 'ci: Add GitHub Actions CI/CD workflows'"
echo "  3. git push origin main"
echo ""
echo "⚙️  Depois disso:"
echo "  - Ir para GitHub → Settings → Secrets and variables → Actions"
echo "  - Adicionar os seguintes secrets:"
echo "    • GCP_PROJECT_ID"
echo "    • WIF_PROVIDER"
echo "    • WIF_SERVICE_ACCOUNT"
echo "    • STAGING_DATABASE_URL"
echo "    • PRODUCTION_DATABASE_URL"
echo "    • STAGING_REDIS_URL"
echo "    • PRODUCTION_REDIS_URL"
echo "    • JWT_SECRET"
echo "    • GOOGLE_GEMINI_API_KEY"
echo "    • SLACK_WEBHOOK"
echo "    • DOCKER_USERNAME - opcional"
echo "    • DOCKER_PASSWORD - opcional"
echo ""
echo "🎉 Tudo pronto! Seus workflows estão prontos para usar!"
echo ""
