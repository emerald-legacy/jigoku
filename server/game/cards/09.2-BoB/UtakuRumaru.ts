import DrawCard from '../../drawcard.js';
import { Players, CardTypes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UtakuRumaru extends DrawCard {
    static id = 'utaku-rumaru';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.isHonored && card.type === CardTypes.Character,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyGlory(1)
        });

        this.persistentEffect({
            match: (card) => card.isDishonored && card.type === CardTypes.Character,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyGlory(-1)
        });

        this.reaction({
            title: 'Honor a participating character',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller
            },
            cost: AbilityDsl.costs.discardCard({
                location: Locations.Hand
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

export default UtakuRumaru;

