import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, PlayType, TargetMode, CardType, Players } from '../../Constants.js';

class RightHandOfTheEmperor extends DrawCard {
    static id = 'right-hand-of-the-emperor';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.opponent !== undefined && context.player.isMoreHonorable(),
            location: Location.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Location.ConflictDiscardPile, [this], this, PlayType.Other)
        });
        this.action({
            title: 'Ready characters',
            target: {
                mode: TargetMode.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: (card: DrawCard) => card.getCost() ?? 0,
                maxStat: () => 6,
                numCards: 0,
                optional: true,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.ready()
            },
            gameAction: AbilityDsl.actions.moveCard((context) => ({
                target: context.source,
                destination: Location.ConflictDeck,
                bottom: true
            })),
            effect: 'ready {0}{1}.  {2} is placed on the bottom of {3}\'s conflict deck',
            effectArgs: (context) => [(context.targets.target as DrawCard[]).length > 0 ? '' : 'no one', context.source, context.source.owner]
        });
    }
}


export default RightHandOfTheEmperor;
