# AXT-AyaKoto/OriginStorages.js

IndexedDBのObjectStoreをWeb Storage APIのように扱うためのラッパーライブラリです。

> A wrapper library for IndexedDB ObjectStore to use it like Web Storage API.

## License

**copyright (c) 2024- Ayasaka-Koto, All rights reserved.**

著作者に不利益を与えたり、あなたが公序良俗に反した用途で使用しない限り、あなたはこの著作物を自由に使用することができます。
ただし、以下を必ず遵守してください。
著作物の利用開始を以て、下記に同意したものとみなします。
- あなたがこれを使用するときは、使用したものが公開されている場所、もしくは使用したものそのものにあなたの有効な連絡先情報(メールアドレスが望ましい)を記述してください。
- もし、私が「あなたの使用方法は許可したくない」と考えたら、その旨を連絡します。そのときは必ず私の指示に従って使用を中止してください。
- 私の名前をクレジットすることは必須ではありませんが、もししてくれるならとても嬉しいです。クレジット表記をする場合は、私のハンドルネームとして「Ayasaka-Koto」を記載してください。

> You are free to use it, as long as you do not cause any harm to the author or use it in a way that violates public order and morality.
> However, you must abide by the following rules.
> (By starting to use it, you are deemed to have agreed to the below terms and conditions.)
> - If you use it, include your valid contact information (preferably an email address) in the place where the work you use is published, or in the work itself.
> - If I think that I do not want to allow your use, I will contact you to that effect. In that case, follow my instructions and stop using it.
> -  It is not necessary to credit me, but I would be very grateful if you did. If you do credit me, please use my handle name "Ayasaka-Koto".

## for Contributors

貢献は自由に行えますが、以下の条件に同意してください。
貢献を行った時点で下記に同意したとみなされます。
- 貢献によって追加された部分の著作権を私に譲渡すること
- 貢献によって追加された部分について、あなたが私に著作者人格権を行使しないこと

> You are free to contribute, but please agree to the following conditions.
> By making a contribution, you are deemed to have agreed to the following:
> - You assign to me the copyright of the parts added through your contribution.
> - You agree not to exercise moral rights against me in the parts added through your contribution.

## Installation

- モジュールとして`script.js`を読み込んでください。
    - ES Moduleの場合 : `import "https://cdn.jsdelivr.net/gh/AXT-AyaKoto/OriginStorages.js/script.js";`

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

