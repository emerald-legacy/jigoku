import { CardType, Duration, Location, Phases, Players } from '../../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DaidojiHiroteru extends DrawCard {
    static id = 'daidoji-hiroteru';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card: DrawCard) => card.isDynasty && card.isFacedown(),
            effect: AbilityDsl.effects.canBeSeenWhenFacedown()
        });

        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card: DrawCard) => card.isDynasty && card.type === CardType.Character,
            effect: AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHand)
        });

        this.reaction('Give a Scout or Shinobi covert')
            .when({
                onCardPlayed: (event, context) =>
                    context.game.currentPhase === Phases.Conflict &&
                    event.player === context.player &&
                    event.card.type === CardType.Character &&
                    event.card.hasSomeTrait('scout', 'shinobi')
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.event.card,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.addKeyword('covert')
            })))
            .effect('give {1} covert until the end of the phase', (context) => [context.event.card]);
    }
}
