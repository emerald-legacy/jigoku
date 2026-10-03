import { CardType, Location, PlayType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class MeditationsOnOrthodoxy extends DrawCard {
    static id = 'meditations-on-orthodoxy';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => Boolean(context.player.opponent) && context.player.isMoreHonorable(),
            location: Location.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Location.ConflictDiscardPile, [this], this, PlayType.Other)
        });

        this.reaction('Ready characters')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .targetCards('target', {
                mode: TargetMode.UpTo,
                activePromptTitle: 'Choose characters',
                numCards: 2,
                cardType: CardType.Character,
                controller: Players.Any
            }, AbilityDsl.actions.ready())
            .then((context) => ({
                gameAction: [
                    AbilityDsl.actions.moveCard({
                        target: context?.source,
                        destination: Location.ConflictDeck,
                        bottom: true
                    })
                ]
            }))
            .max(AbilityDsl.limit.perConflictOpportunity(1));
    }
}
