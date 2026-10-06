import { CardType, Duration, Location, Phases, Players } from '../../../Constants.js';
import { PlayFacedownCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import { addKeyword, canBeSeenWhenFacedown, gainPlayAction } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DaidojiHiroteru extends DrawCard {
    static id = 'daidoji-hiroteru';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card) => card.isDynasty && card.isFacedown(),
            effect: canBeSeenWhenFacedown()
        });

        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card) => card.isDynasty && card.type === CardType.Character,
            effect: gainPlayAction(PlayFacedownCharacterAsIfFromHand)
        });

        this.reaction('Give a Scout or Shinobi covert')
            .when({
                onCardPlayed: (event, context) =>
                    context.game.currentPhase === Phases.Conflict &&
                    event.player === context.player &&
                    event.card.type === CardType.Character &&
                    event.card.hasSomeTrait('scout', 'shinobi')
            })
            .gameAction(cardLastingEffect((context) => ({
                target: context.event.card,
                duration: Duration.UntilEndOfPhase,
                effect: addKeyword('covert')
            })))
            .effect('give {1} covert until the end of the phase', (context) => [context.event.card]);
    }
}
