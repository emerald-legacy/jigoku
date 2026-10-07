import DrawCard from '../../DrawCard.js';

class AsakoLawmaster extends DrawCard {
    static id = 'asako-lawmaster';

    setupCardAbilities() {
        this.reaction('Gain an honor')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .gainHonor();
    }
}


export default AsakoLawmaster;
