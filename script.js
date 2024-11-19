/**
 * OriginStorageを取得
 * @param {string} name - 取得するOriginStorageの名前
 * @returns {Promise<OriginStorage>} - OriginStorage
 */
globalThis.getOriginStorageAccess = async (name) => {
    /** @type {{name: string, version: number}[]} - 今IndexedDBにあるデータベースの一覧 */
    const IDB_DatabaseList = await globalThis.indexedDB.databases();
    /** @type {number} - OriginStorage用DBのバージョン番号、まだデータベースがなければ1 */
    const OriginStorage_IDB_version = IDB_DatabaseList.find(n => n.name == "AXT-AyaKoto/OriginStorages.js")?.version || 1;
    /** @type {IDBOpenDBRequest} - OriginStorage用DBにObjectStore"name"があるかを確認するためのDB接続を開くリクエスト */
    const OriginStorageOpenRequest_storeCheck = globalThis.indexedDB.open("AXT-AyaKoto/OriginStorages.js", OriginStorage_IDB_version);
    /** @type {IDBDatabase} - OriginStorage用DBにObjectStore"name"があるかを確認するためのDB接続 */
    const OriginStorageDB_storeCheck = await new Promise((resolve, reject) => {
        OriginStorageOpenRequest_storeCheck.onsuccess = () => {
            resolve(OriginStorageOpenRequest_storeCheck.result);
        };
        OriginStorageOpenRequest_storeCheck.onerror = () => {
            reject(OriginStorageOpenRequest_storeCheck.error);
        };
    });
    /** @type {string[]} - OriginStorage用DBにObjectStore"name"があるかを確認するためのObjectStoreの名前一覧 */
    const OriginStorageStoreNames = OriginStorageDB_storeCheck.objectStoreNames;
    /** @desc - 一回接続を閉じます */
    OriginStorageDB_storeCheck.close();
    /** @type {boolean} OriginStorage用DBにObjectStore"name"があるか */
    const isTargetStoreExist = OriginStorageStoreNames.contains(name);
    /** @type {number} - 次にDB接続を開くときに指定するバージョン(ObjectStore"name"がなければ現在のバージョン+1、ObjectStore"name"があれば現在のバージョン) */
    const OriginStorageDB_version_onRequest = isTargetStoreExist ? OriginStorage_IDB_version : OriginStorage_IDB_version + 1;
    /** @type {IDBOpenDBRequest} - 本操作を行うためのDB接続を開くリクエスト */
    const OriginStorageOpenRequest_main = globalThis.indexedDB.open("AXT-AyaKoto/OriginStorages.js", OriginStorageDB_version_onRequest);
    /** @desc - ObjectStore"name"がなければupgradeneededイベントの中でそのObjectStoreを作る */
    OriginStorageOpenRequest_main.onupgradeneeded = event => {
        /** @type {IDBDatabase} - IndexedDB"AXT-AyaKoto/OriginStorages.js" */
        const database = event.target.result;
        /** @desc - ObjectStore"name"を新規作成 */
        database.createObjectStore(name, { "keyPath": "key" });
    }
    /** @type {IDBDatabase} - ObjectStore"name"を必ず含むOriginStorage用DBへの接続 */
    const OriginStorageDB_main = await new Promise((resolve, reject) => {
        OriginStorageOpenRequest_main.onsuccess = () => {
            resolve(OriginStorageOpenRequest_main.result);
        }
        OriginStorageOpenRequest_main.onerror = () => {
            reject(OriginStorageOpenRequest_main.error);
        }
    })
    /** @desc - OriginStorageDBとstorageNameを設定したOriginStorageインスタンスを返す */
    return new OriginStorage(OriginStorageDB_main, name);
};

/**
 * @class OriginStorage
 * @property {IDBDatabase} DB - データベースへの接続
 * @property {string} storageName - ストレージの名前
 */
const OriginStorage = class {
    constructor(OriginStorageDB, storageName) {
        this.DB = OriginStorageDB;
        this.storageName = storageName;
    }
    /** @type {(n: number) => Promise<string>} - ストレージ内n番目のキーの名称を返す */
    keys(n) {
        return new Promise((resolve, reject) => {
            /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み不可) */
            const transaction = this.DB.transaction(this.storageName, "readonly");
            /** @desc - 先にエラー発生時のイベント捕捉だけやっておく */
            transaction.onerror = event => {
                throw new Error("Transaction Error");
            }
            /** @type {IDBObjectStore} - 操作先Object Storeへの参照 */
            const objectStore = transaction.objectStore(this.storageName);
            /** @type {IDBRequest} - Object Storeへの読み込みリクエスト */
            const request = objectStore.getAll();
            /** @desc - success → returnValueのn番目のkeyでresolve */
            request.onsuccess = event => {
                resolve(event.target?.result?.[n]?.key);
            }
            /** @desc - error → エラー内容でreject */
            request.onerror = event => {
                reject(event.target.error);
            }
        });
    }
    /** @type {(key: any, value: any) => Promise<void>} - ストレージに指定したキーと値を追加/更新する */
    setItem(key, value) {
        return new Promise((resolve, reject) => {
            /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み可能) */
            const transaction = this.DB.transaction(this.storageName, "readwrite");
            /** @desc - 先にエラー発生時のイベント捕捉だけやっておく */
            transaction.onerror = event => {
                throw new Error("Transaction Error");
            }
            /** @type {IDBObjectStore} - 操作先Object Storeへの参照 */
            const objectStore = transaction.objectStore(this.storageName);
            /** @type {IDBRequest} - Object Storeへの書き込みリクエスト */
            const request = objectStore.put({ key, value });
            /** @desc - success → undefinedでresolve */
            request.onsuccess = event => {
                resolve(void 0);
            }
            /** @desc - error → エラー内容でreject */
            request.onerror = event => {
                reject(event.target.error);
            }
        });
    }
    /** @type {(key: any) => Promise<any>} - ストレージ内の指定したキーの値を取得する */
    getItem(key) {
        return new Promise((resolve, reject) => {
            /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み不可) */
            const transaction = this.DB.transaction(this.storageName, "readonly");
            /** @desc - 先にエラー発生時のイベント捕捉だけやっておく */
            transaction.onerror = event => {
                throw new Error("Transaction Error");
            }
            /** @type {IDBObjectStore} - 操作先Object Storeへの参照 */
            const objectStore = transaction.objectStore(this.storageName);
            /** @type {IDBRequest} - Object Storeへの読み込みリクエスト */
            const request = objectStore.get(key);
            /** @desc - success → 指定keyに対応するvalue(event.target.result)でresolve */
            request.onsuccess = event => {
                resolve(event.target.result);
            }
            /** @desc - error → エラー内容でreject */
            request.onerror = event => {
                reject(event.target.error);
            }
        });
    }
    /** @type {(key: any) => Promise<void>} - ストレージ内の指定したキーと値のペアを削除する */
    removeItem(key) {
        return new Promise((resolve, reject) => {
            /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み可能) */
            const transaction = this.DB.transaction(this.storageName, "readwrite");
            /** @desc - 先にエラー発生時のイベント捕捉だけやっておく */
            transaction.onerror = event => {
                throw new Error("Transaction Error");
            }
            /** @type {IDBObjectStore} - 操作先Object Storeへの参照 */
            const objectStore = transaction.objectStore(this.storageName);
            /** @type {IDBRequest} - Object Storeへの削除リクエスト */
            const request = objectStore.delete(key);
            /** @desc - success → undefinedでresolve */
            request.onsuccess = event => {
                resolve(void 0);
            }
            /** @desc - error → エラー内容でreject */
            request.onerror = event => {
                reject(event.target.error);
            }
        });
    }
    /** @type {() => Promise<void>} - ストレージ内のすべてのキーと値のペアを削除する */
    clear() {
        return new Promise((resolve, reject) => {
            /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み可能) */
            const transaction = this.DB.transaction(this.storageName, "readwrite");
            /** @desc - 先にエラー発生時のイベント捕捉だけやっておく */
            transaction.onerror = event => {
                throw new Error("Transaction Error");
            }
            /** @type {IDBObjectStore} - 操作先Object Storeへの参照 */
            const objectStore = transaction.objectStore(this.storageName);
            /** @type {IDBRequest} - Object Storeへの全削除リクエスト */
            const request = objectStore.clear();
            /** @desc - success → undefinedでresolve */
            request.onsuccess = event => {
                resolve(void 0);
            }
            /** @desc - error → エラー内容でreject */
            request.onerror = event => {
                reject(event.target.error);
            }
        });
    }
    /** @type {Promise<number>} - ストレージ内のキーと値のペアの数を取得する */
    get length() {
        return new Promise((resolve, reject) => {
            /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み不可) */
            const transaction = this.DB.transaction(this.storageName, "readonly");
            /** @desc - 先にエラー発生時のイベント捕捉だけやっておく */
            transaction.onerror = event => {
                throw new Error("Transaction Error");
            }
            /** @type {IDBObjectStore} - 操作先Object Storeへの参照 */
            const objectStore = transaction.objectStore(this.storageName);
            /** @type {IDBRequest} - Object Storeへの全件数カウントリクエスト */
            const request = objectStore.count();
            /** @desc - success → 件数(event.target.result)でresolve */
            request.onsuccess = event => {
                resolve(event.target.result);
            }
            /** @desc - error → エラー内容でreject */
            request.onerror = event => {
                reject(event.target.error);
            }
        });
    }
    /** @type {() => Promise<void>} - DBへの接続を閉じる */
    close() {
        return new Promise((resolve, reject) => {
            this.DB.close();
            resolve(void 0);
        });
    }
}
