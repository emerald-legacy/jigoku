import DrawCard from '../../drawcard.js';

class DojiRepresentative extends DrawCard {
    static id = 'doji-representative';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character home',
            gameAction: ability.actions.sendHome()
        });
    }
}


export default DojiRepresentative;
