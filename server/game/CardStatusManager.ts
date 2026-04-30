import type BaseCard from './basecard';
import { StatusToken } from './StatusToken';
import { CharacterStatus } from './Constants';

export class CardStatusManager {
    statusTokens: StatusToken[] = [];

    constructor(private card: BaseCard) {}

    addStatusToken(tokenType: CharacterStatus | StatusToken): void {
        const status = (tokenType as StatusToken).grantedStatus || (tokenType as CharacterStatus);
        if(!this.statusTokens.find((a) => a.grantedStatus === status)) {
            if(status === CharacterStatus.Honored && this.isDishonored) {
                this.removeStatusToken(CharacterStatus.Dishonored);
            } else if(status === CharacterStatus.Dishonored && this.isHonored) {
                this.removeStatusToken(CharacterStatus.Honored);
            } else {
                const token = StatusToken.create(this.card.game, this.card, status);
                if(token) {
                    token.setCard(this.card);
                    this.statusTokens.push(token);
                }
            }
        }
    }

    removeStatusToken(tokenType: CharacterStatus | StatusToken): void {
        const status = (tokenType as StatusToken).grantedStatus || (tokenType as CharacterStatus);
        const index = this.statusTokens.findIndex((a) => a.grantedStatus === status);
        if(index > -1) {
            const realToken = this.statusTokens[index];
            realToken.setCard(null);
            this.statusTokens.splice(index, 1);
        }
    }

    getStatusToken(tokenType: CharacterStatus): StatusToken | undefined {
        return this.statusTokens.find((a) => a.grantedStatus === tokenType);
    }

    updateStatusTokenEffects(): void {
        if(this.statusTokens) {
            if(this.isHonored && this.isDishonored) {
                this.removeStatusToken(CharacterStatus.Honored);
                this.removeStatusToken(CharacterStatus.Dishonored);
                this.card.game.addMessage(
                    'Honored and Dishonored status tokens nullify each other and are both discarded from {0}',
                    this.card
                );
            }
            this.statusTokens.forEach((token) => {
                token.setCard(this.card);
            });
        }
    }

    get hasStatusTokens(): boolean {
        return !!this.statusTokens && this.statusTokens.length > 0;
    }

    hasStatusToken(type: CharacterStatus): boolean {
        return !!this.statusTokens && this.statusTokens.some((a) => a.grantedStatus === type);
    }

    get isHonored(): boolean {
        return !!this.statusTokens && !!this.statusTokens.find((a) => a.grantedStatus === CharacterStatus.Honored);
    }

    honor(): void {
        if(this.isHonored) {
            return;
        }
        this.addStatusToken(CharacterStatus.Honored);
    }

    get isDishonored(): boolean {
        return !!this.statusTokens && !!this.statusTokens.find((a) => a.grantedStatus === CharacterStatus.Dishonored);
    }

    dishonor(): void {
        if(this.isDishonored) {
            return;
        }
        this.addStatusToken(CharacterStatus.Dishonored);
    }

    get isTainted(): boolean {
        return !!this.statusTokens && !!this.statusTokens.find((a) => a.grantedStatus === CharacterStatus.Tainted);
    }

    taint(): void {
        if(this.isTainted) {
            return;
        }
        this.addStatusToken(CharacterStatus.Tainted);
    }

    untaint(): void {
        if(!this.isTainted) {
            return;
        }
        this.removeStatusToken(CharacterStatus.Tainted);
    }

    makeOrdinary(): void {
        this.removeStatusToken(CharacterStatus.Honored);
        this.removeStatusToken(CharacterStatus.Dishonored);
    }

    isOrdinary(): boolean {
        return !this.isHonored && !this.isDishonored;
    }

    cloneFor(card: BaseCard): CardStatusManager {
        const mgr = new CardStatusManager(card);
        mgr.statusTokens = [...this.statusTokens];
        return mgr;
    }
}
