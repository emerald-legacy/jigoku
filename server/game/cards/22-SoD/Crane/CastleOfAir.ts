import { msg } from '../../../GameChat.js';
import { AbilityType, EventName, CardType, Location } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { modifyProvinceStrength } from '../../../effects.js';
import {
    cardLastingEffect,
    conditional,
    handler,
    multiple,
    selectCard
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { Event } from '../../../Events/Event.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';


export default class CastleOfAir extends DrawCard {
    static id = 'castle-of-air';
    private playersTriggered = new Set<string>();

    setupCardAbilities() {
        const eventRegistrar = new EventRegistrar(this.game, this);
        eventRegistrar.register([
            {
                [EventName.OnModifyHonor + ':' + AbilityType.WouldInterrupt]: 'onHonorLoss'
            }
        ]);
        eventRegistrar.register([EventName.OnConflictFinished]);

        this.action('Add Province Strength')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('shugenja')
            }))
            .condition((context) => context.game.isDuringConflict())
            .gameAction(multiple([
                selectCard({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    cardCondition: (card) => card.isConflictProvince(),
                    message: (context, cards) => msg`${context.player} increases the strength of ${cards}`,
                    gameAction: cardLastingEffect({
                        targetLocation: Location.Provinces,
                        effect: modifyProvinceStrength(4)
                    })
                }),
                conditional((context) => ({
                    condition: context.player.hasAffinity('air', context),
                    trueGameAction: handler({
                        handler: (context) => {
                            this.playersTriggered.add(context.player.uuid);
                        }
                    })
                }))
            ]))
            .chatText((context) => context.player.hasAffinity('air', context)
                ? msg`increase the strength of an attacked province by 4${' and prevent unopposed honor loss'}`
                : msg`increase the strength of an attacked province by 4`);
    }

    onHonorLoss(event: Event & EventPayload<EventName.OnModifyHonor>) {
        if(
            event.context.game.currentConflict &&
            event.dueToUnopposed &&
            this.playersTriggered.has(event.context.player.uuid) &&
            !event.cancelled
        ) {
            event.cancel();
            this.game.addMessage(msg`${this} cancels the honor loss`);
        }
    }

    public onConflictFinished() {
        this.playersTriggered.clear();
    }
}
