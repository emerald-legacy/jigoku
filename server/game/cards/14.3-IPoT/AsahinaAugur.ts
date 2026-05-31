import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, Players, CardTypes } from '../../Constants.js';

class AsahinaAugur extends DrawCard {
    static id = 'asahina-augur';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: card => card.isDynasty && card.isFacedown(),
            effect: AbilityDsl.effects.canBeSeenWhenFacedown()
        });

        this.action<DrawCard>({
            title: 'Discard a card in a province',
            target: {
                cardType: [CardTypes.Character, CardTypes.Holding, CardTypes.Event],
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.discardCard()
            },
            effect: 'discard {1} in {2}',
            effectArgs: context => [context.target?.isFacedown() ? 'a facedown card' : context.target ?? '', context.target?.location ?? ''],
            limit: AbilityDsl.limit.perRound(3)
        });
    }
}


export default AsahinaAugur;
