import { AbilityTypes, EventNames, CardTypes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import BaseCard from '../../../basecard';
import { EventRegistrar } from '../../../EventRegistrar';


export default class CastleOfAir extends DrawCard {
    static id = 'castle-of-air';
    private playersTriggered = new Map<string, boolean>();

    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            {
                [EventNames.OnModifyHonor + ':' + AbilityTypes.WouldInterrupt]: 'onHonorLoss'
            }
        ]);
        this.eventRegistrar.register([EventNames.OnConflictFinished]);

        this.action({
            title: 'Add Province Strength',
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: (card: BaseCard) => card.hasTrait('shugenja')
            }),
            effect: 'increase the strength of an attacked province by 4{1}',
            effectArgs: context => context.player.hasAffinity('air') ? [' and prevent unopposed honor loss'] : [''],
            condition: (context) => context.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.selectCard((context) => ({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    cardCondition: (card) => card.isConflictProvince(),
                    message: '{0} increases the strength of {1}',
                    messageArgs: (cards) => [context.player, cards],
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        targetLocation: Locations.Provinces,
                        effect: AbilityDsl.effects.modifyProvinceStrength(4)
                    })
                })),
                AbilityDsl.actions.conditional((context) => ({
                    condition: context.player.hasAffinity('air'),
                    trueGameAction: AbilityDsl.actions.handler({
                        handler: context => {
                            this.playersTriggered.set(context.player.uuid, true);
                        }
                    }),
                    falseGameAction: AbilityDsl.actions.noAction()
                }))
            ])
        });
    }

    onHonorLoss(event: any) {
        if(
            event.context.game.currentConflict &&
            event.dueToUnopposed &&
            !!this.playersTriggered.get(event.context.player.uuid) &&
            !event.cancelled
        ) {
            event.cancel();
            this.game.addMessage('{0} cancels the honor loss', this);
        }
    }

    public onConflictFinished() {
        this.playersTriggered.clear();
    }
}
