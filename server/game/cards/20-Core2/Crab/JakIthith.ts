import { CardType, Players } from '../../../Constants.js';
import { cannotReceiveTaintedToken, immunity } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

const ATTACHMENT = 'attachment';
const RECEIVER = 'receiver';

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
            .target({
                name: RECEIVER,
                dependsOn: ATTACHMENT,
                cardType: CardType.Character,
                controller: Players.Self
            })
            .ifAble()
            .attach((context) => ({
                attachment: context.targets[ATTACHMENT],
                target: context.targets[RECEIVER],
                takeControl: true
            }))
            .otherwise()
            .discardFromPlay((context) => ({ target: context.targets[ATTACHMENT] }));
    }
}
