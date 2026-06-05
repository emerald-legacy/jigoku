import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UtakuRumaru extends DrawCard {
    static id = 'utaku-rumaru';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: DrawCard) => card.isHonored && card.type === CardType.Character,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyGlory(1)
        });

        this.persistentEffect({
            match: (card: DrawCard) => card.isDishonored && card.type === CardType.Character,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyGlory(-1)
        });

        this.reaction({
            title: 'Honor a participating character',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller
            },
            cost: AbilityDsl.costs.discardCard({
                location: Location.Hand
            }),
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

export default UtakuRumaru;

