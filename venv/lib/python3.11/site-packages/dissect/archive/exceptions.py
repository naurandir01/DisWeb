class Error(Exception):
    pass


class InvalidHeaderError(Error):
    pass


class FileNotFoundError(Error, FileNotFoundError):
    pass


class IsADirectoryError(Error, IsADirectoryError):
    pass


class NotADirectoryError(Error, NotADirectoryError):
    pass


class NotAReparsePointError(Error):
    pass
