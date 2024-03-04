import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RedisCache } from 'cache-manager-ioredis-yet';
import { Cluster, Redis } from 'ioredis';

@Injectable()
export class CacheService {
  public client: Redis | Cluster;

  constructor(
    @Inject(CACHE_MANAGER)
    cacheManager: RedisCache,
  ) {
    this.client = cacheManager.store.client;
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  set(key: string, value: string | Buffer | number): Promise<'OK'> {
    return this.client.set(key, value);
  }

  expire(key: string, time: number): Promise<number> {
    return this.client.expire(key, time);
  }

  ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  del(...keys: string[]): Promise<number> {
    return this.client.del(keys);
  }

  hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  hset(key: string, object: object): Promise<number> {
    return this.client.hset(key, object);
  }

  hdel(key: string, ...fields: string[]): Promise<number> {
    return this.client.hdel(key, ...fields);
  }
}
