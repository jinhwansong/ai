import { Pool, PoolClient } from 'pg';

// PostgreSQL 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 연결 테스트
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// 클라이언트별 마지막 쿼리를 저장하기 위한 WeakMap
const clientLastQuery = new WeakMap<PoolClient, unknown[]>();

export { pool };

// 헬퍼 함수들
export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query;
  const release = client.release;

  // 타이밍을 위한 쿼리 오버라이드
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${clientLastQuery.get(client)}`);
  }, 5000);

  // 클라이언트 쿼리 메서드 오버라이드
  client.query = (...args: unknown[]) => {
    clientLastQuery.set(client, args);
    return query(args[0] as string, args[1] as unknown[]);
  };

  client.release = () => {
    clearTimeout(timeout);
    clientLastQuery.delete(client);
    client.query = originalQuery;
    client.release = release;
    return release.apply(client);
  };

  return client;
};
