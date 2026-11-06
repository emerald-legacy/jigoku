import DrawCard from '../../DrawCard.js';

class KuniPurifier extends DrawCard {
    static id = 'kuni-purifier';

    override setupCardAbilities() {
        this.reaction('Make opponent discard a random card')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            })
            .discardAtRandom();
    }
}


export default KuniPurifier;
