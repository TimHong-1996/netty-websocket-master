package com.yiding.common;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

/**
 * Created by zxm on 2017/8/12.
 *
 */
@Component("redisTakes")
public class RedisTakes implements RedisBaiseTakes<String,String,Object>{
    @Resource(name="redisTemplate")
    private RedisTemplate redisTemplate;

    private Logger logger = Logger.getLogger(String.valueOf(RedisTakes.class));
    @Override
    public void add(String key, String value) {
        if(redisTemplate==null){
            System.out.println("redisTemplate 实例化失败");
            logger.warning("redisTemplate 实例化失败");
            return;
        }else{
            redisTemplate.opsForValue().set(key,value);
        }
    }

    @Override
    public void addObj(String objectKey, String key, Object object,Long timeSecond) {
        if(redisTemplate==null){
            System.out.println("redisTemplate 实例化失败");
            logger.warning("redisTemplate 实例化失败");
            return;
        }else{
            redisTemplate.opsForHash().put(objectKey,key,object);
            redisTemplate.expire(objectKey, timeSecond, TimeUnit.SECONDS);
        }
    }

    @Override
    public void delete(String key) {

    }

    @Override
    public void delete(List<String> listKeys) {

    }

    @Override
    public void deletObj(String objecyKey, String key) {

    }

    @Override
    public void update(String key, String value) {

    }

    @Override
    public void updateObj(String objectKey, String key, Object object) {

    }

    @Override
    public String get(String key) {
        String value = (String) redisTemplate.opsForValue().get(key);
        return value;
    }

    @Override
    public Object getByKey(String key) {
        Map values = redisTemplate.opsForHash().entries(key);

        return values;
    }

    @Override
    public Object getObj(String objectKey, String key) {
        Object seeUser = (Object) redisTemplate.opsForHash().get(objectKey,key);
        return seeUser;
    }
}
