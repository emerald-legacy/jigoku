import { Locations, Players } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

export default class HiddenMoonDojo extends DrawCard {
    static id = 'hidden-moon-dojo';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: (card, context) =>
                !!context &&
                card.isDynasty &&
                card.isFaceup() &&
                context.player.areLocationsAdjacent(context.source.location, card.location),
            effect: AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHand)
        });

        this.action({
            title: 'Turn an adjacent card face up',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.selectCard({
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    context.player.areLocationsAdjacent(context.source.location, card.location),
                gameAction: AbilityDsl.actions.flipDynasty(),
                message: '{0} chooses to turn {1} in {2} faceup',
                messageArgs: (card, player) => [player, card, card.location]
            }),
            effect: 'turn a card in an adjacent province faceup'
        });
    }
}
