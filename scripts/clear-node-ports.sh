 #!/bin/bash

# Node.js 常用端口
NODE_PORTS=(3000 8080 4000)

echo "开始清理 Node.js 端口..."

for PORT in "${NODE_PORTS[@]}"
do
    if lsof -i :$PORT > /dev/null; then
        echo "端口 $PORT 被占用，正在释放..."
        lsof -ti :$PORT | xargs kill -9
        echo "端口 $PORT 已释放"
    else
        echo "端口 $PORT 空闲"
    fi
done

echo "Node.js 端口清理完成！"