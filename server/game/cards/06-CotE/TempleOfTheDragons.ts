import { ProvinceCard } from '../../ProvinceCard.js';

export default class TempleOfTheDragons extends ProvinceCard {
    static id = 'temple-of-the-dragons';

    override setupCardAbilities() {
        this.reaction('Resolve the ring as if you were the attacker')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .resolveConflictRing();
    }
}
