class Error(Exception):
    """Base exception for this module."""


class InvalidSignatureError(Error):
    """Exception that occurs if the magic in the header does not match."""
