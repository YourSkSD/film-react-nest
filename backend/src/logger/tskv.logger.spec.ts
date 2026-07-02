import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let log;
  const tskvLogger = new TskvLogger();

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    log.mockReset();
  });

  it('should log a message', () => {
    tskvLogger.error('module var not found', {
      moduleName: 'network',
      status: 'var error',
      numberOfVar: 7,
    });
    expect(log).toBeCalledTimes(1);
    expect(log).toBeCalledWith(
      'level=error\tmessage=module var not found\toptionalParams=[[{"moduleName":"network","status":"var error","numberOfVar":7}]]',
    );
  });
});
