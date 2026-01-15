import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { Conflict } from '../../../conflict';
import type { AbilityContext } from '../../../AbilityContext';

export default class CompetingInterests extends DrawCard {
    static id = 'competing-interests';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: (context) => this.#hasEnoughUniques(context),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isUnique() && card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }

    #hasEnoughUniques(ctx: AbilityContext) {
        let totalUniques = 0;
        for(const card of (ctx.game.currentConflict as undefined | Conflict).getParticipants() ?? []) {
            if(card.controller !== ctx.player) {
                if(card.isUnique()) {
                    totalUniques++;
                }
                for(const attachment of card.attachments) {
                    if(attachment.isUnique()) {
                        totalUniques++;
                    }
                }

                if(totalUniques >= 2) {
                    return true;
                }
            }
        }
        return false;
    }
}
