import hitRecord from '../../metric/hit-record';
import startPeriodicMetricsRecording from '../../metric/network-metric-recorder';

jest.useFakeTimers();

jest.mock('../../metric/hit-record', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@graphql-portal/logger', () => ({
  prefixLogger: () => ({
    info: jest.fn,
  }),
}));

describe('startPeriodicMetricsRecording', () => {
  it('should push data to redis every second', () => {
    startPeriodicMetricsRecording();
    jest.advanceTimersByTime(5000);
    expect(hitRecord).toBeCalledTimes(5);
  });

  it('second call clears interval and starts writing again', () => {
    startPeriodicMetricsRecording();
    jest.advanceTimersByTime(5000);
    expect(hitRecord).toBeCalledTimes(10);
  });
});
