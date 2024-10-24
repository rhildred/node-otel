# signoz
signoz demo with docker-compose 

```bash
pip install -r requirements.txt
ansible-playbook playbook.yml
```

This is based on [https://signoz.io/opentelemetry/nodejs/](https://signoz.io/opentelemetry/nodejs/). I also tried [logging](https://www.npmjs.com/package/@opentelemetry/exporter-logs-otlp-http). `logging.js` completed, but there were no logs in signoz. I feel like `sdk.start()` would help.

