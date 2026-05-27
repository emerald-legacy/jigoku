import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, PlayTypes, TargetModes, CardTypes, Players } from '../../Constants.js';

class RightHandOfTheEmperor extends DrawCard {
    static id = 'right-hand-of-the-emperor';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.opponent !== undefined && context.player.isMoreHonorable(),
            location: Locations.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDiscardPile, [this], this, PlayTypes.Other)
        });
        this.action({
            title: 'Ready characters',
            target: {
                mode: TargetModes.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: (card: DrawCard) => card.getCost() ?? 0,
                maxStat: () => 6,
                numCards: 0,
                optional: true,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.ready()
            },
            gameAction: AbilityDsl.actions.moveCard((context) => ({
                target: context.source,
                destination: Locations.ConflictDeck,
                bottom: true
            })),
            effect: 'ready {0}{1}.  {2} is placed on the bottom of {3}\'s conflict deck',
            effectArgs: (context) => [context.target.length > 0 ? '' : 'no one', context.source, context.source.owner]
        });
    }
}


export default RightHandOfTheEmperor;
