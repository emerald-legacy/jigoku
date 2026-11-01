describe('ability effect message', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ikoma-ikehata', 'doji-hotaru'],
                    conflictDeck: ['fine-katana', 'ornate-fan']
                },
                player2: {
                    inPlay: ['miya-mystic']
                }
            });
            this.ikehata = this.player1.findCardByName('ikoma-ikehata');
            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
            this.noMoreActions();
        });

        it('names every game action of the ability', function() {
            this.player1.clickRing('air');
            this.player1.clickRing('air');
            this.player1.clickCard(this.shamefulDisplay);
            this.player1.clickCard(this.ikehata);
            this.player1.clickPrompt('Initiate Conflict');
            this.player1.clickPrompt('No Target');
            this.player2.clickCard(this.mystic);
            this.player2.clickPrompt('Done');
            this.noMoreActions();
            this.player1.clickCard(this.ikehata);
            this.player1.clickCard(this.hotaru);
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Ikehata to honor Doji Hotaru and draw 1 card');
        });
    });
});

describe('Playing an event set aside by Stolen Secrets', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['favored-niece', 'soshi-illusionist'],
                    hand: ['stolen-secrets']
                },
                player2: {
                    hand: ['assassination', 'finger-of-jade', 'tattooed-wanderer', 'kami-unleashed', 'censure']
                }
            });
            this.assassination = this.player2.findCardByName('assassination', 'hand');
            for(const name of ['censure', 'assassination', 'finger-of-jade', 'tattooed-wanderer', 'kami-unleashed']) {
                this.player2.player.moveCard(this.player2.findCardByName(name, 'hand'), 'conflict deck');
            }
            this.favoredNiece = this.player1.findCardByName('favored-niece');
            this.favoredNiece.fate = 2;
            this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
            this.stolenSecrets = this.player1.findCardByName('stolen-secrets');

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.favoredNiece, this.soshiIllusionist],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.stolenSecrets);
            this.player1.clickCard(this.favoredNiece);
            this.player1.clickPrompt('Assassination');
            this.player1.clickPrompt('Tattooed Wanderer');
            this.player1.clickPrompt('Finger of Jade');
            expect(this.assassination.location).toBe('removed from game');
            this.player2.pass();
        });

        it('names the card that set it aside', function () {
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.soshiIllusionist);
            expect(this.assassination.location).toBe('conflict discard pile');
            const logs = this.getChatLogs(10);
            expect(logs).toContain('player1 plays Assassination from the cards set aside by Stolen Secrets');
            expect(logs.some((line) => line.includes('removed from game'))).toBe(false);
        });
    });
});

describe('Turning several facedown dynasty cards faceup', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDiscard: ['staging-ground', 'akodo-gunso', 'doji-whisperer']
                }
            });
            this.stagingGround = this.player1.placeCardInProvince('staging-ground', 'province 1');
            this.gunso = this.player1.placeCardInProvince('akodo-gunso', 'province 2');
            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 3');
            this.gunso.facedown = true;
            this.whisperer.facedown = true;
        });

        it('names every province (Staging Ground)', function () {
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.gunso);
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('Done');
            expect(this.gunso.facedown).toBe(false);
            expect(this.whisperer.facedown).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 uses Staging Ground to reveal the facedown cards in province 2 and province 3');
        });

        it('names the one province when one card is turned faceup', function () {
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.gunso);
            this.player1.clickPrompt('Done');
            expect(this.gunso.facedown).toBe(false);
            expect(this.whisperer.facedown).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Staging Ground to reveal the facedown card in province 2');
        });
    });
});

describe('Discarding more random cards than the hand holds', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['assassination']
                },
                player2: {
                    inPlay: ['hida-kisada'],
                    dynastyDiscard: ['river-of-the-last-stand']
                }
            });
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.kisada = this.player2.findCardByName('hida-kisada');
            this.assassination = this.player1.findCardByName('assassination');
            this.river = this.player2.placeCardInProvince('river-of-the-last-stand', 'province 1');
            this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
        });

        it('names the number of cards the hand holds (River of the Last Stand)', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.kuwanan],
                defenders: [this.kisada],
                province: this.p1
            });
            expect(this.player1.hand.length).toBe(1);
            this.player2.clickCard(this.river);
            expect(this.assassination.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player2 uses River of the Last Stand to make player1 discard 1 card at random');
        });
    });
});
