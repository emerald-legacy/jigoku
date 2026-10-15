import DrawCard from '../../DrawCard.js';

class ArmamentArtisan extends DrawCard {
    static id = 'armament-artisan';

    override setupCardAbilities() {
        this.reaction('Honor this character')
            .when({
                onCardHonored: (event, context) => event.card.controller === context.player && event.card !== context.source
            })
            .honor();
    }
}


export default ArmamentArtisan;
