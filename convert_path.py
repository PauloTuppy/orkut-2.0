import sys

windows_path = sys.argv[1]
path_list = windows_path.split(';')
posix_path_list = []
for path in path_list:
    if path:
        # Replace backslashes with forward slashes
        posix_path = path.replace('\\', '/')
        # Replace C: with /c
        if posix_path.startswith('C:'):
            posix_path = '/c' + posix_path[2:]
        posix_path_list.append(posix_path)
posix_path = ':'.join(posix_path_list)
print(posix_path)
