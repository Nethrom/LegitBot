
export default class Model {
    constructor(table) {
        this.table = table;
        this.data = {};
    }

    mapData (data) {
        Object.keys(data).forEach(key => { this.data[key] = data[key]; }) 
    }

    _model () {
        
    }

    create() {
        return new Promise((resolve, reject) => {
            let model = this._model(this.data);
            model.save().then(() => {
                console.log('creating char');
                console.log(this.data);

                resolve();
            }).catch(reject);
        });
    }

    update(data) {
        data = data || this.data;

        return new Promise((resolve, reject) => {
            this.model.findOneAndUpdate(
                {id: this.data.id},
                data)
            .then(() => {
                this.mapData(data);
                resolve(this.data);
            }).catch(reject);
        });
    }

    findById(id) {
        id = id || this.data.id;

        return new Promise((resolve, reject) => {
            this.model.findOne({id: id})
                .then(doc => {
                    if (!doc) {
                        resolve(null);
                        return;
                    }
                    this.mapData(doc._doc);
                    resolve(this.data);
                }).catch(reject);
        });
    }

    static lookup(table, key, value) {
        return new Promise((resolve, reject) => {
            if (!table.find) {
                reject('No model passed');
                return;
            }
            table.findOne({[key]: value})
            .then(doc => {
                if (!doc) {
                    reject('No data found');
                    return;
                }
                resolve(doc._doc);
            }).catch(err => reject(err));
        });
    }
}