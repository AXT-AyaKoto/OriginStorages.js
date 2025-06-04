# AXT-AyaKoto/OriginStorages.js

IndexedDBのObjectStoreをWeb Storage APIのように扱うためのラッパーライブラリです。

> A wrapper library for IndexedDB ObjectStore to use it like Web Storage API.

## License

**copyright (c) 2024- Ayasaka-Koto**
Released Under the [MIT License](https://opensource.org/license/mit).

## Installation

- モジュールとして`module.mjs`を読み込んでください。
    - ES Moduleの場合 : `import "https://cdn.jsdelivr.net/gh/AXT-AyaKoto/OriginStorages.js/module.mjs";`

## Usage / Specs

だいたいWeb Storage APIと同じですが、以下の点に注意。

- `IndexedDB`の`AXT-AyaKoto/OriginStorages.js`という名前のデータベースはこのライブラリ以外は触らない前提で書いてます
    - そのため、外部から触って動かなくなっても責任は取れません
    - 各レコードは`{ key: any, value: any }`です、一応言及
- 1つのOriginに対して複数のStorageを作ることができます
    - `new OriginStorage(name)`で`name`という名前のStorageにアクセスできます
- メソッド・プロパティはすべて`Promise`を返します
    - `async/await`をつかうかメソッドチェーンを作るかしてください

実装されているメソッド・プロパティは以下の通り。

- `OriginStorage` : OriginStorageへのアクセスを提供するクラス
    - `new OriginStorage(name)` : `name`という名前のOriginStorageにアクセスするためのインスタンスを作成
        - `.storageName: string` : 接続先のOriginStorageの名前
        - `.keys: (n: number) => Promise<string>` : ストレージ内n番目のキーの名称を返す
        - `.setItem: (key: any, value: any) => Promise<void>` : ストレージに指定したキーと値を追加/更新
            - エイリアス : `.set(key, value)`
        - `.getItem: (key: any) => Promise<any>` : ストレージ内の指定したキーの値を取得
            - エイリアス : `.get(key)`
        - `.removeItem: (key: any) => Promise<void>` : ストレージ内の指定したキーと値のペアを削除
            - エイリアス : `.delete(key)`
        - `.clear: () => Promise<void>` : ストレージ内のすべてのキーと値のペアを削除
        - `.has: (key: any) => Promise<boolean>` : 指定したキーがストレージ内に存在するかどうかを確認
        - `.values: () => Promise<any[]>` : ストレージ内のすべての値を取得
        - `.length: Promise<number>` : ストレージ内のキーと値のペアの数を取得 (※getter)

