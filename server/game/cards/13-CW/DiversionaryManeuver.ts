import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Locations, CardTypes, Players, TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DiversionaryManeuver extends DrawCard {
    static id = 'diversionary-maneuver';

    setupCardAbilities() {
        this.action<ProvinceCard>({
            title: 'Move the conflict to another province',
            condition: context => context.game.isDuringConflict('military') && context.player.isAttackingPlayer(),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: (card, context) => !card.isConflictProvince() && card.canBeAttacked() && (context.game.currentConflict?.getConflictProvinces() ?? []).some((a: any) => a.controller === card.controller)
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.multiple([
                    AbilityDsl.actions.bow(context => ({
                        target: context.game.currentConflict.getParticipants()
                    })),
                    AbilityDsl.actions.sendHome(context => ({
                        target: context.game.currentConflict.getParticipants()
                    })),
                    AbilityDsl.actions.moveConflict<ProvinceCard>(context => ({
                        target: context.target })),
                    AbilityDsl.actions.selectCard({
                        cardType: CardTypes.Character,
                        location: Locations.PlayArea,
                        controller: Players.Self,
                        player: Players.Self,
                        optional: true,
                        mode: TargetModes.Unlimited,
                        cardCondition: card => !card.bowed,
                        message: '{0} moves {1} to the conflict',
                        messageArgs: (card, player) => [player, card.length > 0 ? card : 'no one'],
                        gameAction: AbilityDsl.actions.moveToConflict()
                    })
                ]),
                AbilityDsl.actions.selectCard({
                    cardType: CardTypes.Character,
                    location: Locations.PlayArea,
                    controller: Players.Opponent,
                    player: Players.Opponent,
                    optional: true,
                    mode: TargetModes.Unlimited,
                    cardCondition: card => !card.bowed,
                    message: '{0} moves {1} to the conflict',
                    messageArgs: (card, player) => [player, card.length > 0 ? card : 'no one'],
                    gameAction: AbilityDsl.actions.moveToConflict()
                })
            ]),
            effect: 'move the conflict to {1} and send all participating characters home bowed',
            effectArgs: context => [context.target ?? '']
        });
    }
}


export default DiversionaryManeuver;

