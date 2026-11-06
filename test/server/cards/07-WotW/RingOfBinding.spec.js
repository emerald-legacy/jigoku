describe('Ring of Binding', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider'],
                    hand: ['ring-of-binding', 'shrine-maiden']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    hand: ['ring-of-binding', 'ring-of-binding']
                }
            });
            this.borderRider = this.player1.findCardByName('border-rider');
            this.shrineMaiden = this.player1.findCardByName('shrine-maiden');
            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.player1.playAttachment('ring-of-binding', this.borderRider);
            this.player2.playAttachment('ring-of-binding', this.mirumotoRaitsugu);
            this.noMoreActions();
        });

        it('should stop the fate from being removed from border rider during the fate phase', function () {
            this.borderRider.fate = 1;
            this.nextPhase();
            this.player2.clickPrompt('Done');
            expect(this.borderRider.fate).toBe(1);
        });

        it('should stop border rider from being discarded in the fate phase', function () {
            expect(this.borderRider.fate).toBe(0);
            this.nextPhase();
            this.player2.clickPrompt('Done');
            expect(this.borderRider.fate).toBe(0);
            expect(this.borderRider.location).toBe('play area');
        });

        it('should not stop raitsugu from removing a fate', function () {
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.mirumotoRaitsugu]
            });
            this.borderRider.fate = 1;
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.borderRider);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.borderRider.fate).toBe(0);
        });

        it('should not stop raitsugu discarding border rider', function () {
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.mirumotoRaitsugu]
            });
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.borderRider);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.borderRider.location).toBe('dynasty discard pile');
        });

        it('should not stop the fate from being removed from raitsugu during the fate phase', function () {
            this.mirumotoRaitsugu.fate = 1;
            this.nextPhase();
            this.player1.clickPrompt('Done');
            expect(this.mirumotoRaitsugu.fate).toBe(0);
        });

        it('should not stop raitsugu from being discarded in the fate phase', function () {
            this.nextPhase();
            this.player2.clickPrompt('Done');
            expect(this.mirumotoRaitsugu.location).toBe('dynasty discard pile');
        });

        it('does not protect a character when the Ring\'s controller isn\'t the first player', function () {
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.shrineMaiden);
            this.player1.clickPrompt('0');
            this.player1.clickPrompt('Pass');
            const ring = this.player2.playAttachment('ring-of-binding', this.shrineMaiden);
            expect(ring.parent).toBe(this.shrineMaiden);
            expect(this.player2.player.firstPlayer).toBe(false);
            this.nextPhase();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            expect(this.shrineMaiden.location).toBe('conflict discard pile');
        });
    });
});

describe('Ring of Binding on an opponent\'s character', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['ring-of-binding']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            expect(this.player1.player.firstPlayer).toBe(true);
            this.ring = this.player1.playAttachment('ring-of-binding', this.dojiWhisperer);
            expect(this.ring.parent).toBe(this.dojiWhisperer);
        });

        it('stops it from being discarded in the fate phase when you are the first player', function () {
            expect(this.dojiWhisperer.fate).toBe(0);
            this.nextPhase();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            expect(this.dojiWhisperer.location).toBe('play area');
        });

        it('stops it from losing fate in the fate phase when you are the first player', function () {
            this.dojiWhisperer.fate = 1;
            this.nextPhase();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            expect(this.dojiWhisperer.fate).toBe(1);
        });
    });
});
