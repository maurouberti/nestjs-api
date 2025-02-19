FROM mongo:8.0.3

ENV MONGO_REPLICA_PORT 27017
ENV MONGO_REPLICA_HOST localhost
ENV MONGO_INITDB_ROOT_USERNAME admin
ENV MONGO_INITDB_ROOT_PASSWORD secret
    
CMD mongod --port $MONGO_REPLICA_PORT --replSet rs0 --bind_ip 0.0.0.0 & \
    MONGOD_PID=$!; \
    INIT_REPL_CMD="rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '$MONGO_REPLICA_HOST:$MONGO_REPLICA_PORT' }] })"; \
    INIT_USER_CMD="db.getSiblingDB('admin').createUser({ \
        user: '$MONGO_INITDB_ROOT_USERNAME', \
        pwd: '$MONGO_INITDB_ROOT_PASSWORD', \
        roles: [{ role: 'root', db: 'admin' }] \
    })"; \
    until mongosh --port $MONGO_REPLICA_PORT --eval "$INIT_REPL_CMD" 2>&1 | grep -q "MongoServerError: already initialized" || mongosh --port $MONGO_REPLICA_PORT --eval "$INIT_REPL_CMD"; do \
    echo "Aguardando inicialização do Replica Set..."; \
    sleep 3; \
    done; \
    echo "Replica Set inicializado."; \
    mongosh --port $MONGO_REPLICA_PORT --eval "$INIT_USER_CMD"; \
    wait $MONGOD_PID;
    