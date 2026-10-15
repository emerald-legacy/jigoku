import { CardType, Players } from '../../../Constants.js';
import { cannotReceiveTaintedToken, immunity } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { attach } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

const ATTACHMENT = 'attachment';

export default class JakIthith extends DrawCard {
    static id = 'jak-ithith';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                immunity({ appliesTo: { trait: 'maho' } }),
                immunity({ appliesTo: { trait: 'shadowlands' } }),
                cannotReceiveTaintedToken()
            ]
        });

        this.reaction('Take control of an attachment')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target({
                name: ATTACHMENT,
                cardType: CardType.Attachment,
                controller: Players.Any,
                cardCondition: (card, context) =>
                    !!card.parentCharacter?.isParticipating() && card.parentCharacter.controller !== context.player
            })
            // "to an eligible character you control, if able": only eligible characters can be chosen
            .ifAble()
            .selectCard((context) => ({
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: attach({
                    attachment: context.targets[ATTACHMENT],
                    takeControl: true
                }),
                message: (context, card, player) => msg`${player} chooses to attach ${context.targets[ATTACHMENT]} to ${card}`
            }))
            .otherwise()
            .discardFromPlay((context) => ({ target: context.targets[ATTACHMENT] }))
            .chatText((context) => {
                const attachment = context.targets[ATTACHMENT];
                const canAttach = context.player.cardsInPlay.some((card) =>
                    attach({ attachment, takeControl: true }).canAffect(card, context));
                return canAttach
                    ? msg`take control of ${attachment.parentCharacter}'s ${attachment}`
                    : msg`discard ${attachment}`;
            });
    }
}
