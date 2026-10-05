import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType, Duration, Players } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';

export default class UndeadHorror extends BaseOni {
    static id = 'undead-horror';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Attach a character to this card')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.player.opponent &&
                    context.player.opponent.dynastyDiscardPile.filter(
                        (card) => card.type === CardType.Character
                    ).length > 0
            })
            .gameAction(AbilityDsl.actions.sequentialContext((context) => {
                const potentialTargets = (context.player.opponent?.dynastyDiscardPile ?? []).filter(
                    (card) => card.type === CardType.Character
                );
                const targetCard = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
                return {
                    gameActions: [
                        AbilityDsl.actions.cardLastingEffect({
                            target: targetCard,
                            canChangeZoneOnce: true,
                            duration: Duration.Custom,
                            effect: [
                                AbilityDsl.effects.blank(true),
                                AbilityDsl.effects.changeType(CardType.Attachment),
                                AbilityDsl.effects.gainAbility(AbilityType.Persistent, {
                                    match: (card, context) => {
                                        const parent = context && context.source.parentCharacter;
                                        return card === parent;
                                    },
                                    targetController: Players.Opponent,
                                    effect: [
                                        AbilityDsl.effects.modifyMilitarySkill(
                                            (_card, context) =>
                                                (context.source.isDrawCard() && context.source.printedMilitarySkill) || 0
                                        ),
                                        AbilityDsl.effects.modifyPoliticalSkill(
                                            (_card, context) =>
                                                (context.source.isDrawCard() && context.source.printedPoliticalSkill) || 0
                                        )
                                    ]
                                })
                            ]
                        }),
                        AbilityDsl.actions.attach({
                            target: context.source,
                            attachment: targetCard
                        }),
                        AbilityDsl.actions.handler({
                            handler: (context) => {
                                context.game.addMessage('{0} is attached to {1}', targetCard, context.source);
                            }
                        })
                    ]
                };
            }))
            .effect('attach a random character from {1}\'s dynasty discard pile to {2}', (context) => [context.player.opponent, context.source]);
    }
}
