from logging import Logger, getLogger, DEBUG, Formatter, StreamHandler

LOG_FORMAT: str = '%(asctime)s [ %(levelname)s ]'

logger: Logger = getLogger('test')
formatter = Formatter(fmt='', datefmt='')
handler: StreamHandler = StreamHandler()

handler.setLevel(DEBUG)
handler.setFormatter(formatter)

logger.propagate = False
logger.addHandler(handler)
logger.setLevel(DEBUG)