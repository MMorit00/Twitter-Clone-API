 #!/bin/bash

# MongoDB 常用端口
MONGO_PORTS=(27017 27018 27019)

echo "开始清理 MongoDB 端口..."

for PORT in "${MONGO_PORTS[@]}"
do
    if lsof -i :$PORT > /dev/null; then
        echo "端口 $PORT 被占用，正在释放..."
        lsof -ti :$PORT | xargs kill -9
        echo "端口 $PORT 已释放"
    else
        echo "端口 $PORT 空闲"
    fi
done

echo "MongoDB 端口清理完成！"