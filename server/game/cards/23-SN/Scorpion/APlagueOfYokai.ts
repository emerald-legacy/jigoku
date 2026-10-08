import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { attachmentMilitarySkillModifier, attachmentPoliticalSkillModifier } from '../../../effects.js';
import { attach, multipleContext, shuffleDeck } from '../../../GameActions/GameActions.js';

export default class APlagueOfYokai extends DrawCard {
    static id = 'a-plague-of-yokai';

    setupCardAbilities() {
        this.whileAttached({
            effect: attachmentMilitarySkillModifier((_card, context) => -this.getSkillModifier(context))
        });
        this.whileAttached({
            effect: attachmentPoliticalSkillModifier((_card, context) => -this.getSkillModifier(context))
        });

        this.conflictAction('Spread the plague')
            .cost(costs.dishonor({
                controller: Players.Self,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating() && card.hasTrait('shinobi')
            }))
            .condition(context => this.getCopiesInDeck(context).length > 0)
            .target({
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    attach().canAffect(card, context, { attachment: this.getCopiesInDeck(context)[0] })
            }, multipleContext(context => ({
                gameActions: [
                    attach({
                        target: context.target,
                        attachment: this.getCopiesInDeck(context)[0]
                    }),
                    shuffleDeck({
                        deck: Location.ConflictDeck,
                        target: context.player
                    })
                ]
            })))
            .chatText('infect {0}');
    }

    private getCopiesInDeck(context: AbilityContext) {
        const player = context.player;
        return player.conflictDeck.filter(card => card.name === context.source.name);
    }

    private getSkillModifier(context: AbilityContext) {
        if(!context.game.currentConflict) {
            return 0;
        }

        const participatingCharacters = context.game.currentConflict.getParticipants();
        const attachments = participatingCharacters.flatMap((current) => current.attachments);

        const matchingAttachments = attachments.filter(a => a.name === context.source.name && a.controller === context.source.controller);
        return matchingAttachments.length;
    }
}
