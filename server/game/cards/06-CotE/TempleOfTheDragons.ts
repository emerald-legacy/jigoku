import { ProvinceCard } from '../../ProvinceCard.js';
import { RingAbilities } from '../../RingAbilities.js';

export default class TempleOfTheDragons extends ProvinceCard {
    static id = 'temple-of-the-dragons';

    override setupCardAbilities() {
        this.reaction('Resolve the ring as if you were the attacker')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .condition((context) => (context.game.currentConflict?.elements ?? []).some((element) =>
                RingAbilities.contextFor(context.player, element, false).ability.hasLegalTargets(context)))
            .resolveConflictRing();
    }
}
