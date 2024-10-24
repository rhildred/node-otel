import { SeverityNumber } from '@opentelemetry/api-logs';
import {
    LoggerProvider,
    BatchLogRecordProcessor,
  } from '@opentelemetry/sdk-logs';
  import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
  
  // exporter options. see all options in OTLPExporterNodeConfigBase
  const collectorOptions = {
    url: 'http://localhost:4318/v1/logs', // url is optional and can be omitted - default is http://localhost:4318/v1/logs
    concurrencyLimit: 1, // an optional limit on pending requests
  };
  const logExporter = new OTLPLogExporter(collectorOptions);
  const loggerProvider = new LoggerProvider();
  
  loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
  
  const logger = loggerProvider.getLogger('default', '1.0.0');
  // Emit a log
  await logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'info',
    body: 'this is a log body',
    attributes: { 'log.type': 'custom' },
  });