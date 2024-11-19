/**
 * OriginStorageへのアクセスを提供するクラス
 * @class OriginStorage
 * @property {string} storageName - ストレージの名前
 */
globalThis.OriginStorage = class {
    constructor(storageName) {
        this.storageName = storageName;
    }
    /** @type {() => Promise<IDBDatabase>} - DBを開いて返す */
    open() {
        return new Promise((resolve, reject) => {
            globalThis.indexedDB.databases().then(value => {
                /** @type {{name: string, version: number}[]} - 今IndexedDBにあるデータベースの一覧 */
                const IDB_DatabaseList = value;
                /** @type {number} - OriginStorage用DBのバージョン番号、まだデータベースがなければ1 */
                const OriginStorage_IDB_version = IDB_DatabaseList.find(n => n.name == "AXT-AyaKoto/OriginStorages.js")?.version || 1;
                /** @type {IDBOpenDBRequest} - OriginStorage用DBにObjectStore"this.storageName"があるかを確認するためのDB接続を開くリクエスト */
                const OriginStorageOpenRequest_storeCheck = globalThis.indexedDB.open("AXT-AyaKoto/OriginStorages.js", OriginStorage_IDB_version);
                /** @desc - 接続エラーが出た場合はそれでreject */
                OriginStorageOpenRequest_storeCheck.onerror = event => {
                    reject(OriginStorageOpenRequest_storeCheck.error);
                };
                /** @desc - 正常にとれた場合 */
                OriginStorageOpenRequest_storeCheck.onsuccess = event => {
                    /** @type {IDBDatabase} - OriginStorage用DBにObjectStore"this.storageName"があるかを確認するためのDB接続 */
                    const OriginStorageDB_storeCheck = OriginStorageOpenRequest_storeCheck.result;
                    /** @type {string[]} - OriginStorage用DBにあるObjectStoreの名前一覧 */
                    const OriginStorageStoreNames = OriginStorageDB_storeCheck.objectStoreNames;
                    /** @desc - 一回接続を閉じる */
                    OriginStorageDB_storeCheck.close();
                    /** @type {boolean} OriginStorage用DBにObjectStore"this.storageName"があるか */
                    const isTargetStoreExist = OriginStorageStoreNames.contains(this.storageName);
                    /** @type {number} - 次にDB接続を開くときに指定するバージョン(ObjectStore"this.storageName"がなければ現在のバージョン+1、ObjectStore"this.storageName"があれば現在のバージョン) */
                    const OriginStorageDB_version_onRequest = isTargetStoreExist ? OriginStorage_IDB_version : OriginStorage_IDB_version + 1;
                    /** @type {IDBOpenDBRequest} - 本操作を行うためのDB接続を開くリクエスト */
                    const OriginStorageOpenRequest_main = globalThis.indexedDB.open("AXT-AyaKoto/OriginStorages.js", OriginStorageDB_version_onRequest);
                    /** @desc - ObjectStore"this.storageName"がなければupgradeneededイベントの中でそのObjectStoreを作る */
                    OriginStorageOpenRequest_main.onupgradeneeded = event => {
                        /** @type {IDBDatabase} - IndexedDB"AXT-AyaKoto/OriginStorages.js" */
                        const database = event.target.result;
                        /** @desc - ObjectStore"this.storageName"を新規作成 */
                        database.createObjectStore(this.storageName, { "keyPath": "key" });
                    }
                    /** @desc - 接続エラーが出た場合はそれでreject */
                    OriginStorageOpenRequest_main.onerror = event => {
                        reject(OriginStorageOpenRequest_main.error);
                    };
                    /** @desc - 正常にとれた場合はDBでresolve */
                    OriginStorageOpenRequest_main.onsuccess = event => {
                        resolve(OriginStorageOpenRequest_main.result);
                    };
                }
            });
        });
    }
    async openAsync() {
        /** @type {{name: string, version: number}[]} - 今IndexedDBにあるデータベースの一覧 */
        const IDB_DatabaseList = await globalThis.indexedDB.databases();
        /** @type {number} - OriginStorage用DBのバージョン番号、まだデータベースがなければ1 */
        const OriginStorage_IDB_version = IDB_DatabaseList.find(n => n.name == "AXT-AyaKoto/OriginStorages.js")?.version || 1;
        /** @type {IDBOpenDBRequest} - OriginStorage用DBにObjectStore"this.storageName"があるかを確認するためのDB接続を開くリクエスト */
        const OriginStorageOpenRequest_storeCheck = globalThis.indexedDB.open("AXT-AyaKoto/OriginStorages.js", OriginStorage_IDB_version);
        /** @desc - 接続エラーが出た場合はそれでreject */
        OriginStorageOpenRequest_storeCheck.onerror = () => {
            throw new Error(OriginStorageOpenRequest_storeCheck.error);
        };
        /** @desc - 正常にとれた場合 */
        OriginStorageOpenRequest_storeCheck.onsuccess = () => {
            /** @type {IDBDatabase} - OriginStorage用DBにObjectStore"this.storageName"があるかを確認するためのDB接続 */
            const OriginStorageDB_storeCheck = OriginStorageOpenRequest_storeCheck.result;
            /** @type {string[]} - OriginStorage用DBにあるObjectStoreの名前一覧 */
            const OriginStorageStoreNames = OriginStorageDB_storeCheck.objectStoreNames;
            /** @desc - 一回接続を閉じる */
            OriginStorageDB_storeCheck.close();
            /** @type {boolean} OriginStorage用DBにObjectStore"this.storageName"があるか */
            const isTargetStoreExist = OriginStorageStoreNames.contains(this.storageName);
            /** @type {number} - 次にDB接続を開くときに指定するバージョン(ObjectStore"this.storageName"がなければ現在のバージョン+1、ObjectStore"this.storageName"があれば現在のバージョン) */
            const OriginStorageDB_version_onRequest = isTargetStoreExist ? OriginStorage_IDB_version : OriginStorage_IDB_version + 1;
            /** @type {IDBOpenDBRequest} - 本操作を行うためのDB接続を開くリクエスト */
            const OriginStorageOpenRequest_main = globalThis.indexedDB.open("AXT-AyaKoto/OriginStorages.js", OriginStorageDB_version_onRequest);
            /** @desc - ObjectStore"this.storageName"がなければupgradeneededイベントの中でそのObjectStoreを作る */
            OriginStorageOpenRequest_main.onupgradeneeded = event => {
                /** @type {IDBDatabase} - IndexedDB"AXT-AyaKoto/OriginStorages.js" */
                const database = event.target.result;
                /** @desc - ObjectStore"this.storageName"を新規作成 */
                database.createObjectStore(this.storageName, { "keyPath": "key" });
            }
            /** @desc - 接続エラーが出た場合はそれでreject */
            OriginStorageOpenRequest_main.onerror = () => {
                throw new Error(OriginStorageOpenRequest_main.error);
            };
            /** @desc - 正常にとれた場合はDBでresolve */
            OriginStorageOpenRequest_main.onsuccess = () => {
                return OriginStorageOpenRequest_main.result;
            };
        };
    }
    /** @type {(n: number) => Promise<string>} - ストレージ内n番目のキーの名称を返す */
    keys(n) {
        return new Promise((resolve, reject) => {
            this.open().then(OriginStorageDB => {
                /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み不可) */
                const transaction = OriginStorageDB.transaction(this.storageName, "readonly");
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
        });
    }
    /** @type {(key: any, value: any) => Promise<void>} - ストレージに指定したキーと値を追加/更新する */
    setItem(key, value) {
        return new Promise((resolve, reject) => {
            this.open().then(OriginStorageDB => {
                /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み可能) */
                const transaction = OriginStorageDB.transaction(this.storageName, "readwrite");
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
        });
    }
    /** @type {(key: any) => Promise<any>} - ストレージ内の指定したキーの値を取得する */
    getItem(key) {
        return new Promise((resolve, reject) => {
            this.open().then(OriginStorageDB => {
                /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み不可) */
                const transaction = OriginStorageDB.transaction(this.storageName, "readonly");
                /** @desc - 先にエラー発生時のイベント捕捉だけやっておく */
                transaction.onerror = event => {
                    throw new Error("Transaction Error");
                }
                /** @type {IDBObjectStore} - 操作先Object Storeへの参照 */
                const objectStore = transaction.objectStore(this.storageName);
                /** @type {IDBRequest} - Object Storeへの読み込みリクエスト */
                const request = objectStore.get(key);
                /** @desc - success → 指定keyに対応するvalue(event.target.result.value)でresolve */
                request.onsuccess = event => {
                    resolve(event.target.result.value);
                }
                /** @desc - error → エラー内容でreject */
                request.onerror = event => {
                    reject(event.target.error);
                }
            });
        });
    }
    /** @type {(key: any) => Promise<void>} - ストレージ内の指定したキーと値のペアを削除する */
    removeItem(key) {
        return new Promise((resolve, reject) => {
            this.open().then(OriginStorageDB => {
                /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み可能) */
                const transaction = OriginStorageDB.transaction(this.storageName, "readwrite");
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
        });
    }
    /** @type {() => Promise<void>} - ストレージ内のすべてのキーと値のペアを削除する */
    clear() {
        return new Promise((resolve, reject) => {
            this.open().then(OriginStorageDB => {
                /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み可能) */
                const transaction = OriginStorageDB.transaction(this.storageName, "readwrite");
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
        });
    }
    /** @type {Promise<number>} - ストレージ内のキーと値のペアの数を取得する */
    get length() {
        return new Promise((resolve, reject) => {
            this.open().then(OriginStorageDB => {
                /** @type {IDBTransaction} - ストレージに対応するストアにアクセスするトランザクション(書き込み不可) */
                const transaction = OriginStorageDB.transaction(this.storageName, "readonly");
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
        });
    }
}
