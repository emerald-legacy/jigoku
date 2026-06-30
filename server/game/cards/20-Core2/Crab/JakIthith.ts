import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

const ATTACHMENT = 'attachment';
const RECEIVER = 'receiver';

export default class JakIthith extends DrawCard {
    static id = 'jak-ithith';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.immunity({ restricts: 'maho' }),
                AbilityDsl.effects.immunity({ restricts: 'shadowlands' }),
                AbilityDsl.effects.cannotReceiveTaintedToken()
            ]
        });

        this.reaction({
            title: 'Take control of an attachment',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            },
            targets: {
                [ATTACHMENT]: {
                    cardType: CardType.Attachment,
                    controller: Players.Opponent,
                    cardCondition: (card) =>
                        Boolean(card.parent && card.parent.type === CardType.Character && card.parent.isParticipating())
                },
                [RECEIVER]: {
                    dependsOn: ATTACHMENT,
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.ifAble((context) => ({
                        ifAbleAction: AbilityDsl.actions.attach({
                            attachment: context.targets[ATTACHMENT],
                            target: context.targets[RECEIVER],
                            takeControl: true
                        }),
                        otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.targets[ATTACHMENT] })
                    }))
                }
            }
        });
    }
}
