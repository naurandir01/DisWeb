class Error(Exception):
    pass


class InvalidFilesystemError(Error):
    pass


class FileNotFoundError(Error, FileNotFoundError):
    pass


class IsADirectoryError(Error, IsADirectoryError):
    pass


class NotADirectoryError(Error, NotADirectoryError):
    pass


class NotASymlinkError(Error):
    pass
