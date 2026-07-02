import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let log;
  const jsonLogger = new JsonLogger();

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    log.mockReset();
  });

  it('should log a message', () => {
    jsonLogger.error('module var not found', {
      moduleName: 'network',
      status: 'var error',
      numberOfVar: 7,
    });
    expect(log).toBeCalledTimes(1);
    expect(log).toBeCalledWith(
      '{"level":"error","message":"module var not found","optionalParams":[[{"moduleName":"network","status":"var error","numberOfVar":7}]]}',
    );
  });
});
