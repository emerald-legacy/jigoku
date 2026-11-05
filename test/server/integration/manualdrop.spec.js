describe('Manually moving a card out of a deck', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['banzai'],
                    dynastyDiscard: ['doji-whisperer']
                }
            });
            this.banzai = this.player1.findCardByName('banzai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.player1.moveCard(this.banzai, 'conflict deck');
            this.player1.moveCard(this.whisperer, 'dynasty deck');
            this.game.manualMode = true;
        });

        it('does not name the card when it goes from the conflict deck to the hand', function() {
            this.game.drop('player1', this.banzai.uuid, 'conflict deck', 'hand');
            expect(this.banzai.location).toBe('hand');
            expect(this.getChatLogs(3)).toContain('player1 manually moves a card from their conflict deck to their hand');
        });

        it('does not name the card when it goes from the dynasty deck to a province', function() {
            this.game.drop('player1', this.whisperer.uuid, 'dynasty deck', 'province 1');
            expect(this.whisperer.location).toBe('province 1');
            expect(this.getChatLogs(3)).toContain('player1 manually moves a card from their dynasty deck to their province 1');
        });

        it('names the card when it goes from the deck to a revealing pile', function() {
            this.game.drop('player1', this.banzai.uuid, 'conflict deck', 'conflict discard pile');
            expect(this.banzai.location).toBe('conflict discard pile');
            expect(this.getChatLogs(3)).toContain('player1 manually moves Banzai! from their conflict deck to their conflict discard pile');
        });
    });
});

describe('Manually moving a card out from under the stronghold', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['imperial-storehouse', 'kaiu-shihobu', 'hida-kisada'],
                    dynastyDeckSize: 4
                }
            });
            this.storehouse = this.player1.findCardByName('imperial-storehouse');
            this.kaiuShihobu = this.player1.placeCardInProvince('kaiu-shihobu');
            this.player1.moveCard(this.storehouse, 'dynasty deck');

            this.player1.clickCard(this.kaiuShihobu);
            this.player1.clickPrompt('0');
            this.player1.clickCard(this.kaiuShihobu);
            this.player1.clickPrompt('Imperial Storehouse');
            this.stronghold = this.player1.player.stronghold;
            this.game.manualMode = true;
        });

        it('moves the card and takes it off the stronghold', function() {
            expect(this.storehouse.location).toBe('underneath stronghold');
            expect(this.stronghold.childCards).toContain(this.storehouse);

            this.game.drop('player1', this.storehouse.uuid, 'underneath stronghold', 'dynasty discard pile');
            expect(this.storehouse.location).toBe('dynasty discard pile');
            expect(this.stronghold.childCards).not.toContain(this.storehouse);
            expect(this.getChatLogs(3)).toContain('player1 manually moves Imperial Storehouse from their underneath stronghold to their dynasty discard pile');
        });

        it('does not name the hidden card when it goes to a province', function() {
            this.game.drop('player1', this.storehouse.uuid, 'underneath stronghold', 'province 2');
            expect(this.storehouse.location).toBe('province 2');
            expect(this.stronghold.childCards).not.toContain(this.storehouse);
            expect(this.getChatLogs(3)).toContain('player1 manually moves a card from their underneath stronghold to their province 2');
        });

        it('does not put a card under the stronghold', function() {
            const kisada = this.player1.findCardByName('hida-kisada');
            this.game.drop('player1', kisada.uuid, 'dynasty discard pile', 'underneath stronghold');
            expect(kisada.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(3)).not.toContain('player1 manually moves Hida Kisada from their dynasty discard pile to their underneath stronghold');
        });
    });
});

describe('Manually moving a card out from under another card', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi'],
                    conflictDiscard: ['let-go', 'fine-katana']
                }
            });
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.letGo = this.player1.findCardByName('let-go');
            this.katana = this.player1.findCardByName('fine-katana');
            this.player1.player.placeUnderneath(this.letGo, this.yoshi);
            this.player1.player.placeUnderneath(this.katana, this.yoshi);
            this.game.manualMode = true;
        });

        it('moves the card and takes it out of the host\'s pile', function() {
            expect(this.letGo.location).toBe('underneath');

            this.game.drop('player1', this.letGo.uuid, 'underneath', 'hand');
            expect(this.letGo.location).toBe('hand');
            expect(this.letGo.host).toBeNull();
            expect(this.player1.player.getSourceList(this.yoshi.uuid)).toEqual([this.katana]);
            expect(this.getChatLogs(3)).toContain('player1 manually moves Let Go from their underneath to their hand');
        });

        it('does not move a card that is not underneath', function() {
            this.game.drop('player1', this.yoshi.uuid, 'underneath', 'hand');
            expect(this.yoshi.location).toBe('play area');
        });

        it('does not put a card underneath without a host', function() {
            this.game.drop('player1', this.yoshi.uuid, 'play area', 'underneath');
            expect(this.yoshi.location).toBe('play area');
            expect(this.getChatLogs(3)).not.toContain('player1 manually moves Kakita Yoshi from their play area to their underneath');
        });
    });
});
