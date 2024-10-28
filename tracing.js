// tracing.js
'use strict'
const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');

// for logging
const { SeverityNumber } = require( '@opentelemetry/api-logs');
const {
    LoggerProvider,
    BatchLogRecordProcessor,
  } = require('@opentelemetry/sdk-logs');
const { OTLPLogExporter } = require( '@opentelemetry/exporter-logs-otlp-http');
  

const exporterOptions = {
   url: 'http://localhost:4318/v1/traces'
   }
   
const traceExporter = new OTLPTraceExporter(exporterOptions);
const sdk = new opentelemetry.NodeSDK({
   traceExporter,
   instrumentations: [getNodeAutoInstrumentations()],
   resource: new Resource({
      [ATTR_SERVICE_NAME]: 'node_app'
      })
});

// do some logging

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

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry

sdk.start()

logger.emit({
   severityNumber: SeverityNumber.INFO,
   severityText: 'info',
   body: 'this is a log body',
   attributes: { 'log.type': 'custom' },
 });


// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
   sdk.shutdown()
 .then(() => console.log('Tracing terminated'))
 .catch((error) => console.log('Error terminating tracing', error))
 .finally(() => process.exit(0));
 });