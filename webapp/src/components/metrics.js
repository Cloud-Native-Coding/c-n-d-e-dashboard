import { useState, useEffect } from "react";
import { api } from "./api";
import styles from "./metrics.module.scss";

const METRICS_UPDATE_INTERVAL = 3000;

export function useMetrics(clusterName) {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const [fetchedMetrics, ok] = await api.clusters.getMetrics(clusterName);
      if (ok) {
        setMetrics(prevMetrics => {
          const newClusterMetrics = { ...prevMetrics[clusterName] };

          fetchedMetrics.forEach(({ devenvuserId, ...rest }) => {
            newClusterMetrics[devenvuserId] = rest;
          });

          return {
            ...prevMetrics,
            [clusterName]: newClusterMetrics
          };
        });
      }
    }, METRICS_UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [clusterName]);

  return metrics;
}

function Metric({ label, value }) {
  if (!value) return null;

  return (
    <div>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}

export function Metrics({ metrics }) {
  if (!metrics) return null;

  return (
    <div className={styles.metrics}>
      <Metric label="Status" value={metrics.status || "pending"} />
      <Metric
        label="Cpu"
        value={(val => {
          const result = parseFloat(val);

          if (Number.isNaN(result)) {
            return null;
          }

          return `${Math.floor(result * 1000)}m`;
        })(metrics.cpu)}
      />
      <Metric
        label="Memory"
        value={(val => {
          const result = parseInt(val);

          if (Number.isNaN(result)) {
            return null;
          }

          return `${Math.floor(result / (1024 * 1024))}Mi`;
        })(metrics.memory)}
      />
    </div>
  );
}
