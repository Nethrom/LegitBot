import Model from './model'
import DataModel from './character.model'

class Character extends Model {
    constructor (data) {
        super("characters");
        if (data) this.mapData(data);

        this.model = DataModel;
    }

    static startCharacter(author) {
        return {
            id: author.id, 
            name: author.username,
            xp: 0, 
            total_xp: 0,
            gold: 0,
            level: 1,
            rank: '',
        }
    }

    _model(data) {
        return new DataModel(data);
    }

    addXP (xp) {
        if (isNaN(xp)) { console.log('bad XP gains'); return; }

        this.data.xp += xp;
        this.data.total_xp += xp;

        let xpRequired = (this.data.level * 1.42) * 42;
        if (this.data.xp >= xpRequired) {
            this.data.xp -= xpRequired;
            this.levelUp();
        }

        console.log(this.data.name + " gained " + xp + "XP");

        this.update({xp: this.data.xp, total_xp: this.data.total_xp});
    }

    levelUp () {
        this.data.level++;
        
        let goldBonus = Math.floor((Math.random() * this.data.level) + (Math.random() * this.data.level));
        this.data.gold += goldBonus;

        console.log(this.data.name + " leveled up!  They are now level " + this.data.level + " and gained " + goldBonus + " gold.");

        this.update({level: this.data.level, gold: this.data.gold});
    }

    transferGold (to, amt) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (self.data.gold < amt) { reject('you are a toy..you cant fly (or gift that amount)'); return; }
    
            self.data.gold -= amt;
            to.data.gold += amt;

            self.update({gold: self.data.gold});
            to.update({gold: to.data.gold});

            resolve('```css\n' + `${this.data.name} gave ${amt} gold to ${to.data.name}. 💸` + '\n```');
        });
    }

    static allCharacters() {
        return new Promise((resolve, reject) => {
            DataModel.find({})
                .then(docs => {
                    resolve(docs.map(doc => doc._doc));
                }).catch(reject);
        });
    }

    static async byName(name) {
        try {
            let data = await super.lookup(DataModel, 'name', name);
            return new Character(data);
        }
        catch (er) {
            console.log(er);
        }
    }
}

module.exports = Character;