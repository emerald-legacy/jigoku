describe('Kinutanuki Yoite', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'master-tactician', 'akodo-toturi'],
                    hand: []
                },
                player2: {
                    inPlay: ['kinutanuki-yoite'],
                    hand: ['invocation-of-ash', 'unleash-the-djinn']
                }
            });

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.tactician = this.player1.findCardByName('master-tactician');
            this.toturi = this.player1.findCardByName('akodo-toturi');

            this.kinutanukiYoite = this.player2.findCardByName('kinutanuki-yoite');
            this.invocationOfAsh = this.player2.findCardByName('invocation-of-ash');
            this.unleashTheDjinn = this.player2.findCardByName('unleash-the-djinn');

            this.noMoreActions();
        });

        it('discards characters with event spells', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuBerserker, this.tactician, this.toturi],
                defenders: [this.kinutanukiYoite]
            });

            this.player2.clickCard(this.unleashTheDjinn);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.kinutanukiYoite);

            this.player2.clickCard(this.kinutanukiYoite);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
            expect(this.player2).toBeAbleToSelect(this.tactician);
            expect(this.player2).toBeAbleToSelect(this.toturi);

            this.player2.clickCard(this.toturi);
            expect(this.toturi.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player2 uses Kinutanuki Yoite to injure Akodo Toturi');
        });

        it('removes fate if character has a fate', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuBerserker, this.tactician, this.toturi],
                defenders: [this.kinutanukiYoite]
            });

            this.toturi.fate = 1;

            this.player2.clickCard(this.unleashTheDjinn);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.kinutanukiYoite);

            this.player2.clickCard(this.kinutanukiYoite);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
            expect(this.player2).toBeAbleToSelect(this.tactician);
            expect(this.player2).toBeAbleToSelect(this.toturi);

            this.player2.clickCard(this.toturi);
            expect(this.toturi.location).toBe('play area');
            expect(this.toturi.fate).toBe(0);
            expect(this.getChatLogs(5)).toContain('player2 uses Kinutanuki Yoite to injure Akodo Toturi');
        });

        it('discards characters with attachment spells', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuBerserker, this.tactician, this.toturi],
                defenders: [this.kinutanukiYoite]
            });

            this.player2.clickCard(this.invocationOfAsh);
            this.player2.clickCard(this.kinutanukiYoite);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.kinutanukiYoite);

            this.player2.clickCard(this.kinutanukiYoite);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
            expect(this.player2).toBeAbleToSelect(this.tactician);
            expect(this.player2).not.toBeAbleToSelect(this.toturi);

            this.player2.clickCard(this.tactician);
            expect(this.tactician.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player2 uses Kinutanuki Yoite to injure Master Tactician');
        });
    });
});

describe('Kinutanuki Yoite with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['kinutanuki-yoite', 'endless-plains-skirmisher'],
                    hand: ['unleash-the-djinn']
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.yoite = this.player2.findCardByName('kinutanuki-yoite');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');
            this.djinn = this.player2.findCardByName('unleash-the-djinn');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.yoite]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
        });

        it('chooses a character on the enemy side, whoever controls it', function () {
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player2.clickCard(this.djinn);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.yoite);
            expect(this.player2).toBeAbleToSelect(this.berserker);
            expect(this.player2).toBeAbleToSelect(this.skirmisher2);
            expect(this.player2).not.toBeAbleToSelect(this.skirmisher1);

            this.player2.clickCard(this.skirmisher2);
            expect(this.getChatLogs(5)).toContain('player2 uses Kinutanuki Yoite to injure Endless Plains Skirmisher');
        });
    });
});
